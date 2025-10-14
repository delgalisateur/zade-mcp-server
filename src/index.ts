#!/usr/bin/env node

/**
 * Zade MCP Server
 * Ce serveur MCP permet d'interagir avec un conteneur Kali Linux via Docker Desktop
 * Il offre un accès complet au matériel de la machine hôte
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import Docker from 'dockerode';

// Interface pour les résultats de commande
interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

// Configuration du serveur
const server = new Server(
  {
    name: "zade",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialisation du client Docker
const docker = new Docker();
let kaliContainer: any = null;
const CONTAINER_NAME = "kali-mcp-container";

/**
 * Démarrer ou récupérer le conteneur Kali Linux
 */
async function getOrCreateKaliContainer(): Promise<any> {
  try {
    // Vérifier si le conteneur existe déjà
    const containers = await docker.listContainers({ all: true });
    const existingContainer = containers.find((c: any) => c.Names.includes(`/${CONTAINER_NAME}`));
    
    if (existingContainer) {
      const container = docker.getContainer(existingContainer.Id);
      
      if (existingContainer.State === 'running') {
        console.error(`[MCP] Conteneur Kali déjà en cours d'exécution: ${existingContainer.Id}`);
        return container;
      } else {
        // Redémarrer le conteneur s'il est arrêté
        await container.start();
        console.error(`[MCP] Conteneur Kali redémarré: ${existingContainer.Id}`);
        return container;
      }
    }

    // Créer un nouveau conteneur Kali avec accès matériel complet
    console.error(`[MCP] Création d'un nouveau conteneur Kali...`);
    const container = await docker.createContainer({
      Image: "kalilinux/kali-rolling:latest",
      name: CONTAINER_NAME,
      Cmd: ["/bin/bash"],
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      HostConfig: {
        Privileged: true, // Accès matériel complet
        Mounts: [
          {
            Type: "bind",
            Source: "/tmp",
            Target: "/host_tmp"
          }
        ],
        CapAdd: ["ALL"], // Toutes les capacités
        SecurityOpt: ["seccomp=unconfined"], // Désactiver seccomp
      },
      WorkingDir: "/root"
    });

    await container.start();
    console.error(`[MCP] Nouveau conteneur Kali démarré: ${container.id}`);
    
    // Attendre que le conteneur soit prêt
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return container;
  } catch (error) {
    console.error(`[MCP] Erreur lors de la création du conteneur Kali:`, error);
    throw new McpError(
      ErrorCode.InternalError,
      `Impossible de créer/démarrer le conteneur Kali: ${error}`
    );
  }
}

/**
 * Exécuter une commande dans le conteneur Kali
 */
async function executeCommand(container: any, command: string): Promise<CommandResult> {
  try {
    console.error(`[MCP] Exécution de la commande: ${command}`);
    
    // Créer un stream d'exécution
    const exec = await container.exec({
      Cmd: ["/bin/bash", "-c", command],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });
    
    let stdout = "";
    let stderr = "";
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => {
        const data = chunk.toString();
        // Docker multiplexe stdout et stderr
        if (chunk.length > 8 && chunk[0] === 1) {
          stdout += chunk.slice(8).toString();
        } else if (chunk.length > 8 && chunk[0] === 2) {
          stderr += chunk.slice(8).toString();
        } else {
          stdout += data;
        }
      });

      stream.on('end', async () => {
        try {
          const inspect = await exec.inspect();
          resolve({
            exitCode: inspect.ExitCode || 0,
            stdout: stdout.trim(),
            stderr: stderr.trim()
          });
        } catch (error) {
          reject(error);
        }
      });

      stream.on('error', reject);
    });
  } catch (error) {
    console.error(`[MCP] Erreur lors de l'exécution de la commande:`, error);
    throw new McpError(
      ErrorCode.InternalError,
      `Erreur lors de l'exécution de la commande: ${error}`
    );
  }
}

/**
 * Valider si une commande est potentiellement dangereuse
 */
function validateCommand(command: string): { valid: boolean; warning?: string } {
  const dangerousPatterns = [
    /rm\s+-rf\s+\//,           // rm -rf /
    /mkfs/,                    // Formatage de filesystem
    /dd\s+if=/,                // dd avec entrée
    /:\(\)/,                   // Fork bomb
    /shutdown/,                // Arrêt système
    /reboot/,                  // Redémarrage
    /halt/,                    // Arrêt
    /poweroff/,                // Arrêt
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(command)) {
      return {
        valid: false,
        warning: `Commande potentiellement dangereuse détectée: ${command}`
      };
    }
  }

  return { valid: true };
}

/**
 * Handler pour lister les outils disponibles
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "run_command",
        description: "Exécuter une commande dans un conteneur Kali Linux avec accès matériel complet",
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "Commande à exécuter dans le conteneur Kali Linux"
            }
          },
          required: ["command"]
        }
      },
      {
        name: "start_kali_container",
        description: "Démarrer ou créer le conteneur Kali Linux",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "stop_kali_container",
        description: "Arrêter le conteneur Kali Linux",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_container_status",
        description: "Obtenir le statut du conteneur Kali Linux",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ]
  };
});

/**
 * Handler pour l'exécution des outils
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "run_command": {
        const command = String(args?.command);
        
        if (!command) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Le paramètre 'command' est requis"
          );
        }

        // Validation de la commande
        const validation = validateCommand(command);
        if (!validation.valid) {
          return {
            content: [{
              type: "text",
              text: `⚠️ ATTENTION: ${validation.warning}\n\nSi vous souhaitez continuer malgré cet avertissement, contactez l'administrateur système.`
            }],
            isError: true
          };
        }

        // S'assurer que le conteneur est démarré
        if (!kaliContainer) {
          kaliContainer = await getOrCreateKaliContainer();
        }

        // Exécuter la commande
        const result = await executeCommand(kaliContainer, command);

        const output = `🐧 Commande: ${command}\n` +
                      `📤 Code de sortie: ${result.exitCode}\n\n` +
                      `📋 Sortie standard:\n${result.stdout || "(vide)"}\n\n` +
                      `❌ Erreurs:\n${result.stderr || "(aucune)"}`;

        return {
          content: [{
            type: "text",
            text: output
          }],
          isError: result.exitCode !== 0
        };
      }

      case "start_kali_container": {
        kaliContainer = await getOrCreateKaliContainer();
        return {
          content: [{
            type: "text",
            text: "✅ Conteneur Kali Linux démarré avec succès!\n\n" +
                  "🔧 Configuration: Accès matériel complet activé\n" +
                  "📁 Montages: /tmp de l'hôte vers /host_tmp dans le conteneur\n" +
                  "🛡️  Sécurité: Mode privilégié avec toutes les capacités"
          }]
        };
      }

      case "stop_kali_container": {
        try {
          // Vérifier si le conteneur existe dans Docker
          const containers = await docker.listContainers({ all: true });
          const existingContainer = containers.find((c: any) => c.Names.includes(`/${CONTAINER_NAME}`));
          
          if (existingContainer) {
            const container = docker.getContainer(existingContainer.Id);
            
            if (existingContainer.State === 'running') {
              await container.stop();
            }
            
            await container.remove({ force: true });
            kaliContainer = null;
            
            return {
              content: [{
                type: "text",
                text: "✅ Conteneur Kali Linux arrêté et supprimé avec succès!"
              }]
            };
          } else {
            return {
              content: [{
                type: "text",
                text: "ℹ️ Aucun conteneur Kali Linux trouvé. Utilisez 'start_kali_container' pour en créer un."
              }]
            };
          }
        } catch (error) {
          console.error("[MCP] Erreur lors de l'arrêt du conteneur:", error);
          throw new McpError(
            ErrorCode.InternalError,
            `Erreur lors de l'arrêt du conteneur: ${error}`
          );
        }
      }

      case "get_container_status": {
        try {
          const containers = await docker.listContainers({ all: true });
          const kaliContainerInfo = containers.find((c: any) => c.Names.includes(`/${CONTAINER_NAME}`));
          
          if (kaliContainerInfo) {
            // Vérifications sécurisées des propriétés
            const id = kaliContainerInfo.Id ? kaliContainerInfo.Id.substring(0, 12) : "Inconnu";
            const name = (kaliContainerInfo.Names && kaliContainerInfo.Names.length > 0) ? kaliContainerInfo.Names[0] : "Inconnu";
            const state = kaliContainerInfo.State || "Inconnu";
            const image = kaliContainerInfo.Image || "Inconnu";
            const created = kaliContainerInfo.Created || "Inconnu";
            const ports = (kaliContainerInfo.Ports && Array.isArray(kaliContainerInfo.Ports) && kaliContainerInfo.Ports.length > 0) 
              ? JSON.stringify(kaliContainerInfo.Ports) 
              : "Aucun";
            
            const status = `📊 Statut du conteneur Kali Linux:\n\n` +
                          `🆔 ID: ${id}\n` +
                          `🏷️  Nom: ${name}\n` +
                          `🟢 État: ${state}\n` +
                          `🖼️  Image: ${image}\n` +
                          `⏰ Créé: ${created}\n` +
                          `🌐 Ports: ${ports}`;
            
            return {
              content: [{
                type: "text",
                text: status
              }]
            };
          } else {
            return {
              content: [{
                type: "text",
                text: "❌ Aucun conteneur Kali Linux trouvé. Utilisez 'start_kali_container' pour en créer un."
              }]
            };
          }
        } catch (error) {
          console.error("[MCP] Erreur détaillée dans get_container_status:", error);
          throw new McpError(
            ErrorCode.InternalError,
            `Erreur lors de la vérification du statut: ${error}`
          );
        }
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Outil inconnu: ${name}`
        );
    }
  } catch (error) {
    console.error(`[MCP] Erreur dans l'outil ${name}:`, error);
    throw error;
  }
});

/**
 * Démarrer le serveur MCP
 */
async function main() {
  console.error("[MCP] Démarrage du serveur Zade MCP...");
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("[MCP] Serveur Zade MCP démarré avec succès!");
}

// Gestion des erreurs et arrêt propre
process.on('SIGINT', async () => {
  console.error("[MCP] Arrêt du serveur...");
  if (kaliContainer) {
    try {
      await kaliContainer.stop();
      console.error("[MCP] Conteneur Kali arrêté");
    } catch (error) {
      console.error("[MCP] Erreur lors de l'arrêt du conteneur:", error);
    }
  }
  process.exit(0);
});

main().catch((error) => {
  console.error("[MCP] Erreur du serveur:", error);
  process.exit(1);
});
