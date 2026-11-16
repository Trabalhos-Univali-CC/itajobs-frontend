# ItaJobs

O ItaJobs é uma plataforma de empregos voltada a Itajaí, em Santa Catarina. Seu objetivo é aproximar candidatos e empresas da região, facilitando a busca por trabalho e a divulgação de oportunidades.

Os candidatos podem pesquisar vagas, criar um currículo com suas competências, experiências e formação, enviar candidaturas e acompanhar suas inscrições. Também podem conhecer as empresas e consultar suas avaliações.

As empresas possuem uma área própria para publicar e gerenciar vagas, pesquisar candidatos com currículo cadastrado e consultar as informações dos profissionais interessados nas oportunidades.

Este repositório contém o frontend do ItaJobs, desenvolvido como projeto acadêmico da disciplina de Engenharia de Software II da Universidade do Vale do Itajaí (UNIVALI).

## Tecnologias utilizadas

- **Next.js 16:** estrutura da aplicação, navegação entre páginas e integração com a API.
- **React 19:** construção dos componentes e das interfaces interativas.
- **TypeScript 5:** tipagem dos dados e do código da aplicação.
- **Tailwind CSS 4:** estilização e adaptação das telas para diferentes dispositivos.
- **shadcn/ui e Base UI:** componentes de interface, como botões, selects, menus e modais.
- **Three.js:** cena animada em 3D utilizada na tela de login.
- **React Icons e Lucide React:** ícones utilizados nas páginas e nos componentes.
- **ESLint 9:** análise do código e verificação de padrões.

## Como rodar o projeto

É necessário ter o Node.js 20.9 ou superior e o npm instalados. Para utilizar login, cadastros e as demais funcionalidades, o backend também precisa estar em execução e com o banco de dados configurado.

1. Na pasta do projeto, instale as dependências:

   ```bash
   npm ci
   ```

2. Copie o arquivo `.env.example` para `.env.local`, na raiz do projeto. Configure o endereço do backend:

   ```env
   API_URL=http://localhost:5176
   ```

   A conexão usa exclusivamente a variável `API_URL`. Substitua o endereço de exemplo pelo utilizado na sua API, sem acrescentar `/api` ao final. Reinicie o frontend caso altere essa configuração.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Outros comandos

Para verificar o código com o ESLint:

```bash
npm run lint
```

Para gerar e executar a versão de produção:

```bash
npm run build
npm start
```
