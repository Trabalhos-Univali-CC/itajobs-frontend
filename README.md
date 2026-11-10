# ItaJobs frontend

Next.js 16, React 19, TypeScript, Tailwind CSS 4 e shadcn/Base UI.

## Executar

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

O frontend abre em `http://localhost:3000`. Defina `API_URL` em `.env.local` com o endereço do backend, sem `/api` no final. O padrão é `http://localhost:5176`. Reinicie o Next após alterar essa configuração.

As requisições do navegador usam `/api/...`. O Next encaminha essas chamadas para a API real por `rewrites`, evitando depender de CORS no backend. Não existem banco em memória, dados de demonstração, sessão simulada ou rotas locais de API.

## Funcionalidades

- `/`: consultar vagas, filtrando por cargo e empresa.
- `/vagas/[id]`: consultar uma vaga e registrar uma candidatura.
- `/cadastro/candidato` e `/cadastro/empresa`: cadastrar os respectivos registros.
- `/cadastros`: listar candidatos e empresas.
- `/cadastros/[tipo]/[id]`: consultar, atualizar e excluir um cadastro; atualizar a nota da empresa.
- `/curriculo`: consultar por ID do candidato ou do currículo, criar e excluir currículo, cadastrar/remover habilidades e cadastrar/editar/remover experiências.
- `/candidaturas`: consultar e cancelar candidaturas de um candidato.
- `/painel/vagas`: consultar as vagas de uma empresa.
- `/painel/vagas/nova`: publicar vaga.
- `/painel/vagas/[id]`: editar/excluir vaga e consultar seus candidatos.
- `/painel/candidatos/[id]`: consultar o currículo de um candidato.
- `/login`: consultar um cadastro real por ID, sem autenticação.

Cada operação envia a requisição correspondente. A interface só altera os registros após a resposta da API. Não há sincronização em lote nem repetição automática de requisições.

## Contrato do backend

Integração baseada no commit `5d7bcc0a61f44c81d63be14ba5018c13930a6849` de [itajobs-backend](https://github.com/Trabalhos-Univali-CC/itajobs-backend).

A API ainda não oferece login, senha, sessão ou autorização. Por isso, cadastro não pede senha e consulta por ID não é apresentada como login autenticado.

O currículo suporta apenas identificação do candidato, habilidades e experiências. Foto, portfólio, resumo, descrição da experiência, projetos, formações e idiomas não são enviados nem apresentados como salvos.

O backend deve estar executando com um PostgreSQL configurado e com as tabelas do modelo atual. A migration inicial versionada nesse commit cria apenas a tabela `exemplo`; sozinha, ela não prepara as tabelas de candidatos, empresas, vagas, currículos e candidaturas. A estrutura precisa ser provisionada no projeto do backend antes do uso.

## Verificação

```powershell
npm run lint
npx tsc --noEmit
npm run build
```
