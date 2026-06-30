# ClimaTrack

ClimaTrack e uma aplicacao web de monitoramento climatico construida com React, Vite e TypeScript. O projeto permite consultar o clima atual e a previsao para qualquer cidade, salvar favoritos, acompanhar o historico de buscas, alternar entre tema claro e escuro e abrir um chat flutuante integrado a um workflow do n8n.

## Visao geral

A aplicacao foi organizada para manter responsabilidades separadas entre interface, estado, servicos e formatacao de dados. As consultas geograficas e meteorologicas usam a API da Open-Meteo, enquanto favoritos, historico, tema e unidade ficam persistidos no navegador. O chatbot usa Axios para enviar mensagens ao webhook configurado no n8n.

## Funcionalidades

- Busca de cidades por nome.
- Exibicao do clima atual, previsao por hora e previsao diaria.
- Indicadores climaticos como umidade, vento, precipitacao, sensacao termica e condicao do tempo.
- Lista de cidades favoritas.
- Historico das ultimas buscas.
- Alternancia entre unidades Celsius e Fahrenheit.
- Tema claro e escuro.
- Persistencia local de favoritos, historico, preferencia de tema e identificador do chat.
- ChatWidget flutuante no canto inferior direito.
- Envio de mensagens para o webhook do n8n via Axios.
- Tratamento de loading e erro no chatbot.
- Interface responsiva para desktop e mobile.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- Axios
- Radix UI
- shadcn/ui
- lucide-react
- Sonner
- Open-Meteo API
- n8n webhook para o chatbot

## Estrutura do projeto

```text
src/
  app/
    components/
      weather/   # Telas e blocos especificos do dominio de clima
      ui/        # Componentes de interface reutilizaveis
    hooks/       # Estado e persistencia
    schemas/     # Validacao
    services/    # Integracoes com APIs externas
    types/       # Tipos compartilhados do dominio principal
    utils/       # Funcoes puras de formatacao e normalizacao
  components/
    chat/        # ChatWidget, bubbles e input do chatbot
  services/      # Service do chatbot
  types/         # Tipos do chatbot
  main.tsx       # Ponto de entrada da aplicacao
```

## Como executar

### Pre-requisitos

- Node.js instalado
- npm instalado

### Instalacao

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Build de producao

```bash
npm run build
```

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```bash
VITE_N8N_WEBHOOK_URL=https://sua-url-do-n8n/webhook
VITE_N8N_ALERT_WEBHOOK_URL=https://sua-url-do-n8n/webhook-alert
VITE_N8N_TIP_WEBHOOK_URL=https://sua-url-do-n8n/webhook-dica
```

## Dados utilizados

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Previsao do tempo: `https://api.open-meteo.com/v1/forecast`
- Chatbot: valor configurado em `VITE_N8N_WEBHOOK_URL`

## Persistencia local

O projeto salva no navegador:

- Cidades favoritas
- Historico de buscas
- Preferencia de tema
- Unidade de temperatura
- Identificador local do chat para o webhook do n8n
- Configurações de alerta climático (e-mail e status de ativação)

## Navegacao principal

- Inicio
- Favoritos
- Historico
- Configuracoes

## Notas de implementacao

- O clima padrao carregado ao abrir a aplicacao e `Rio de Janeiro`.
- A logica de busca, favoritos e historico esta separada em hooks para manter os componentes mais simples.
- A formatacao de temperatura, data e codigo meteorologico fica centralizada em `src/app/utils/`.
- O chat flutuante vive em `src/components/chat/` e se comunica com o n8n via `src/services/chatbot-service.ts`.
- A resposta esperada do webhook e `{ reply: string, intent?: string, city?: string }`.
- Em desenvolvimento, o Vite faz proxy de `/webhook` e `/webhook-test` para `http://localhost:5678` para evitar bloqueios de CORS ao chamar o n8n local.

## Licenca

Defina aqui a licenca do projeto, caso deseje distribuido-lo publicamente.
