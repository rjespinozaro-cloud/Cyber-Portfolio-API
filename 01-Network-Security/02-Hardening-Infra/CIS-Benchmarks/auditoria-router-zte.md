# Reporte Técnico: Auditoría de Dispositivo de Red (ZTE F6600P)

## 🎯 Objetivo
Evaluar la superficie de ataque y los servicios expuestos de un nodo de red doméstica.

## 🔍 Metodología
- **Reconocimiento:** `nmap -sV -p- [IP_DEL_ROUTER]`
- **Análisis de Banners:** Identificación de versiones de software.

## 🚩 Hallazgos Críticos
| Servicio | Puerto | Protocolo | Estado | Riesgo |
| :--- | :--- | :--- | :--- | :--- |
| Telnet | 23 | TCP | ABIERTO | ALTO |
| HTTP | 80 | TCP | ABIERTO | MEDIO |

## 💡 Recomendaciones de Hardening
1. **Deshabilitar Telnet:** El tráfico viaja en texto plano; se debe migrar a SSH (Cifrado).
2. **Filtrado de IPs:** Implementar una lista blanca (Whitelisting) para el acceso administrativo.
