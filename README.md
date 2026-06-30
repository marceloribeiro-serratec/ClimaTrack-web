# ClimaTrack — Aplicativo de Previsão do Tempo com Chatbot e Automação

## Sobre o projeto

O **ClimaTrack** é um aplicativo web desenvolvido para consulta e monitoramento da previsão do tempo. A aplicação permite que o usuário pesquise uma cidade e visualize informações climáticas importantes, como temperatura atual, sensação térmica, umidade, velocidade do vento, precipitação, previsão por hora e previsão para os próximos dias.

Além da consulta tradicional de clima, o projeto também conta com um **chatbot integrado**, permitindo que o usuário faça perguntas em linguagem natural, como por exemplo:

* “Qual o clima no Rio de Janeiro?”
* “Vai chover hoje?”
* “Como está o tempo em São Paulo?”

Para tornar o projeto mais completo, também foi criada uma integração com o **n8n**, responsável por automatizar fluxos e conectar o chatbot a serviços externos, como a API de previsão do tempo.

---

## Objetivo

O objetivo deste projeto foi criar uma aplicação moderna, funcional e bem estruturada, utilizando tecnologias atuais do ecossistema front-end e explorando o uso de inteligência artificial como ferramenta de apoio ao desenvolvimento.

A proposta não foi apenas construir uma tela visual, mas desenvolver uma aplicação com funcionalidades reais, consumo de API externa, validação de formulário, componentização, organização de código e integração com automação.

---

## Tecnologias utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

* **React**
* **Vite**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Axios**
* **Zod**
* **React Hook Form**
* **Lucide React**
* **n8n**
* **Open-Meteo API**

Cada tecnologia foi escolhida com um propósito específico. O React foi utilizado para a construção da interface, o Vite para garantir um ambiente de desenvolvimento rápido, o TypeScript para melhorar a segurança do código, o Tailwind CSS para estilização, o shadcn/ui para componentes visuais modernos, o Axios para consumo de APIs, o Zod e o React Hook Form para validação de formulários, e o n8n para automação e integração do chatbot.

---

## Como a inteligência artificial foi utilizada no desenvolvimento

Este projeto foi desenvolvido com apoio de ferramentas de inteligência artificial, utilizadas principalmente como suporte para planejamento, estruturação e aceleração do desenvolvimento.

O processo começou com a criação de um prompt no ChatGPT, descrevendo a ideia principal do aplicativo: um sistema de previsão do tempo desenvolvido com React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Axios, Zod, React Hook Form e outras bibliotecas necessárias.

A partir desse prompt inicial, foi gerado um planejamento mais completo do projeto, incluindo:

* funcionalidades principais;
* organização das telas;
* estrutura de pastas;
* bibliotecas recomendadas;
* modelo de consumo da API;
* sugestões de componentes;
* regras de negócio;
* ideias de melhoria para o projeto.

Depois disso, o prompt estruturado foi utilizado no **Codex**, que auxiliou na criação da base do projeto. O Codex gerou a estrutura inicial da aplicação em React com Vite, configurando as principais bibliotecas e organizando os arquivos de forma componentizada.

A inteligência artificial foi utilizada como uma ferramenta de apoio, mas as decisões sobre o funcionamento do projeto, ajustes, testes, correções e direcionamento da aplicação foram conduzidas durante o processo de desenvolvimento.

---

## Etapas de criação do projeto

O desenvolvimento foi dividido em algumas etapas principais.

### 1. Planejamento da aplicação

A primeira etapa foi definir o que o aplicativo deveria fazer. A ideia principal era criar uma aplicação de previsão do tempo com uma interface moderna, simples de usar e com dados reais vindos de uma API gratuita.

Nesta fase, foram definidos os principais recursos do sistema:

* busca por cidade;
* exibição do clima atual;
* previsão por hora;
* previsão semanal;
* tratamento de erros;
* estados de carregamento;
* histórico de buscas;
* favoritos;
* chatbot integrado;
* automação com n8n.

---

### 2. Estruturação do projeto com Codex

Após o planejamento inicial, foi criado um prompt detalhado para o Codex implementar o projeto respeitando boas práticas de desenvolvimento.

Uma das preocupações principais foi manter o código simples, organizado e de fácil manutenção. Por isso, foi solicitado que os componentes não ficassem todos dentro das páginas, mas fossem separados em pastas específicas.

A estrutura foi pensada para separar responsabilidades, com pastas como:

```txt
src/
├── components/
├── hooks/
├── pages/
├── services/
├── schemas/
├── types/
├── utils/
└── lib/
```

Essa organização facilita a manutenção do projeto e torna o código mais claro para futuras melhorias.

---

### 3. Consumo da API de previsão do tempo

Para obter os dados climáticos, foi utilizada a **Open-Meteo API**, uma API gratuita que permite consultar informações de clima e previsão sem necessidade de chave de acesso.

A aplicação realiza dois tipos principais de requisição:

1. Primeiro, busca a latitude e longitude da cidade pesquisada.
2. Depois, utiliza essas coordenadas para consultar os dados climáticos.

Esse fluxo permite que o usuário pesquise uma cidade pelo nome, enquanto a aplicação se encarrega de transformar essa informação em coordenadas para consultar a previsão do tempo.

---

### 4. Validação do formulário de busca

A busca por cidade foi implementada com **React Hook Form** e **Zod**.

O objetivo foi garantir que o usuário não envie dados inválidos ou vazios. Por exemplo, o campo de cidade precisa ter pelo menos dois caracteres antes de realizar a busca.

Essa validação melhora a experiência do usuário e evita chamadas desnecessárias para a API.

---

```bash
VITE_N8N_WEBHOOK_URL=https://sua-url-do-n8n/webhook
VITE_N8N_ALERT_WEBHOOK_URL=https://sua-url-do-n8n/webhook-alert
VITE_N8N_TIP_WEBHOOK_URL=https://sua-url-do-n8n/webhook-dica
### 5. Criação do chatbot

Depois da aplicação principal estar estruturada, foi criada a funcionalidade de chatbot.

A ideia do chatbot foi permitir uma interação mais natural com o sistema. Em vez de apenas preencher um campo de busca, o usuário pode escrever uma pergunta simples sobre o clima.

O chatbot foi planejado com os seguintes recursos:

* botão flutuante para abrir e fechar o chat;
* janela de conversa;
* mensagem inicial do assistente;
* envio de mensagens pelo usuário;
* estado de carregamento enquanto aguarda resposta;
* exibição da resposta retornada pela automação;
* tratamento de erro caso o serviço esteja indisponível.

A estrutura do chatbot também foi organizada em componentes separados, mantendo o padrão do restante do projeto.

---

### 6. Integração com n8n

Para tornar o chatbot funcional, foi criado um fluxo de automação no **n8n**.

O n8n recebe a mensagem enviada pelo usuário através de um Webhook. A partir dessa mensagem, o fluxo interpreta a cidade informada, consulta a API da Open-Meteo e retorna uma resposta formatada para o front-end.

O fluxo criado no n8n segue a seguinte lógica:

```txt
Webhook
↓
Extração da cidade informada
↓
Consulta à API de geocoding
↓
Consulta à API de previsão do tempo
↓
Formatação da resposta
↓
Resposta para o aplicativo
```

Com isso, o chatbot consegue responder perguntas sobre o clima utilizando dados reais.

---

## Funcionalidades implementadas

Entre as principais funcionalidades do projeto estão:

* pesquisa de clima por cidade;
* exibição da temperatura atual;
* exibição da sensação térmica;
* exibição da umidade;
* exibição da velocidade do vento;
* exibição da precipitação;
* previsão por hora;
* previsão para os próximos dias;
* formulário com validação;
* consumo de API externa;
* chatbot integrado;
* automação com n8n;
* tratamento de erros;
* estados de carregamento;
* código organizado em componentes.

---

## Organização do código

Uma das preocupações durante o desenvolvimento foi evitar que toda a lógica ficasse concentrada em um único arquivo ou em uma única página.

Por isso, o projeto foi separado em camadas:

### Components

Contém os componentes reutilizáveis da interface, como cards, formulários, seções de previsão e componentes do chatbot.

### Services

Contém as funções responsáveis por fazer requisições externas, como chamadas para a API de previsão do tempo e para o webhook do n8n.

### Hooks

Contém lógicas reutilizáveis da aplicação, como busca de clima, favoritos ou histórico.

### Schemas

Contém as validações feitas com Zod.

### Types

Contém as interfaces e tipos TypeScript utilizados no projeto.

### Utils

Contém funções auxiliares, como formatação de datas, temperatura e descrição dos códigos climáticos.

Essa divisão torna o projeto mais organizado, mais fácil de entender e mais simples de evoluir.

---

## Papel da IA no projeto

A inteligência artificial teve um papel importante como ferramenta de apoio durante o desenvolvimento. Ela foi utilizada para ajudar na organização das ideias, criação de prompts, sugestão de arquitetura, geração inicial de código e estruturação das funcionalidades.

Mesmo com o apoio da IA, foi necessário analisar os resultados, testar o funcionamento, corrigir erros, adaptar o código ao layout criado e tomar decisões durante o desenvolvimento.

O uso da IA ajudou principalmente a acelerar etapas repetitivas e a transformar a ideia inicial em uma estrutura mais clara e organizada. Porém, o desenvolvimento exigiu acompanhamento, entendimento técnico e ajustes manuais para que a aplicação funcionasse corretamente.

---

## Aprendizados do projeto

Durante o desenvolvimento deste projeto, foi possível praticar conceitos importantes, como:

* criação de aplicações com React e Vite;
* uso de TypeScript em projetos front-end;
* componentização;
* consumo de APIs externas;
* validação de formulários;
* organização de pastas;
* integração com automações externas;
* criação de chatbot;
* uso de Webhooks;
* estruturação de fluxos no n8n;
* tratamento de erros e estados de carregamento;
* uso de IA como ferramenta de apoio ao desenvolvimento.

Um dos principais aprendizados foi entender como a inteligência artificial pode ser usada de forma produtiva no desenvolvimento de software, não como uma substituição do desenvolvedor, mas como uma ferramenta que auxilia no planejamento, na geração de ideias e na aceleração de algumas etapas do processo.

---

## Conclusão

O ClimaTrack foi desenvolvido como um projeto prático para unir front-end moderno, consumo de API, automação e inteligência artificial no processo de desenvolvimento.

A aplicação demonstra como é possível criar um sistema funcional a partir de uma ideia inicial, passando por planejamento, estruturação, implementação, integração com serviços externos e automação.

O uso do ChatGPT e do Codex contribuiu para organizar melhor o projeto e acelerar o desenvolvimento, enquanto o n8n permitiu criar uma camada de automação para conectar o chatbot à API de previsão do tempo.

O resultado é uma aplicação com proposta real, estrutura organizada e potencial para evoluir com novas funcionalidades, como alertas de chuva, notificações diárias, recomendações para corrida, favoritos sincronizados com banco de dados e histórico climático.

