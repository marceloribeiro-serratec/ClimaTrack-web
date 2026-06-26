# Favoritos Implementation Plan

Projeto: ClimaTrack

Objetivo: deixar a funcionalidade de favoritos clara, consistente e fácil de manter no app React + Vite, sem quebrar o layout atual.

## Situação atual

- O fluxo de favoritos já existe no código.
- O botão de estrela está no card principal do clima.
- A lista de favoritos aparece na aba `Favoritos`.
- Os dados são persistidos em `localStorage`.
- A implementação atual pode estar com baixa percepção visual de ação, o que faz o usuário pensar que nada aconteceu ao clicar.

## O que já existe

- `useFavorites` para adicionar, remover, limpar e verificar favoritos.
- `CurrentWeatherCard` com botão de estrela.
- `FavoriteCities` para listar as cidades salvas.
- `storageKeys.favorites` para persistência.

## Hipótese principal do problema

O comportamento de adicionar/remover pode estar funcionando, mas sem feedback visual suficiente no ponto de interação.

Possíveis causas:

- o estado de favorito muda, mas o usuário não percebe a troca imediatamente;
- o card pode não estar refletindo claramente a condição ativo/inativo da estrela;
- não há toast, texto auxiliar ou animação de confirmação;
- a cidade favoritada pode não aparecer imediatamente em uma área visível após o clique.

## Plano de implementação

1. Validar o estado atual da estrela no card principal.
2. Garantir que o ícone mude imediatamente entre favoritar e desfavoritar.
3. Adicionar feedback visual curto após o clique:
   - toast de confirmação, ou
   - microtexto/label temporário, ou
   - animação discreta do botão.
4. Garantir que a lista de favoritos reflita a mudança sem recarregar a página.
5. Revisar a persistência em `localStorage` para confirmar que o valor salvo é estável.
6. Confirmar que favoritos e remoção usam a mesma chave de cidade.
7. Ajustar o estado vazio de favoritos para orientar melhor o usuário.

## Arquivos que provavelmente serão tocados

- `src/app/components/weather/CurrentWeatherCard.tsx`
- `src/app/components/weather/FavoriteCities.tsx`
- `src/app/hooks/useFavorites.ts`
- `src/app/utils/city.ts`
- `src/app/utils/storageKeys.ts`
- `src/app/App.tsx`

## Melhorias possíveis

- mostrar um toast ao favoritar/remover;
- destacar a estrela com transição mais visível;
- exibir contador de favoritos no header ou na aba de favoritos;
- permitir remover diretamente da lista de favoritos;
- garantir que a cidade favoritada reapareça no dashboard sem navegar manualmente.

## Ordem sugerida de execução

1. Confirmar se o toggle atual muda o estado corretamente.
2. Melhorar o feedback visual do botão.
3. Validar persistência no `localStorage`.
4. Testar remoção e readição da mesma cidade.
5. Se necessário, adicionar toast ou mensagem temporária.

## Critérios de aceite

- Clicar na estrela altera o estado visual imediatamente.
- A cidade aparece na aba `Favoritos`.
- Remover da estrela ou da lista atualiza o estado sem recarregar a página.
- O valor persiste ao recarregar o navegador.
- O comportamento fica claro para o usuário.

## Observação

Se o problema for apenas de percepção visual, não é necessário refatorar a arquitetura.
Nesse caso, uma melhoria pequena no feedback do botão resolve.

