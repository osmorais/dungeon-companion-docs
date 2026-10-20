# Especificações do Projeto: WedSnap

## 1. Objetivo
Criar uma plataforma web progressiva (PWA/Mobile-first) para casamentos onde os convidados podem:
- Fazer upload de fotos em tempo real diretamente da câmera do celular.
- Visualizar um feed cronológico de fotos enviadas por todos os convidados.
- Participar de "Desafios de Fotos" (ex: "Tire uma foto com a avó da noiva").
- **Foco:** Simplicidade, rapidez de carregamento e experiência mobile impecável.
- **Sem login:** não há autenticação de usuário. O acesso é via QR code disponibilizado no evento; o convidado só informa o nome no momento do upload.

## 2. Fluxo do Convidado (UX)

Não existe cadastro, login ou sessão persistente. Todo o acesso parte de um QR code (impresso ou exibido no evento) que leva à landing page do site.

1. **Landing page**: apresentação curta do site (do que se trata, como funciona).
2. A partir da landing, duas opções:
   - **Ver galeria**: feed cronológico com todas as fotos já enviadas. Essa tela deve **sempre** exibir um CTA visível (ex: botão flutuante fixo) para ir direto ao fluxo de upload, independente de o convidado já ter passado por ele antes.
   - **Enviar foto**: inicia o fluxo de upload abaixo.
3. **Fluxo de upload**:
   1. Informar o **nome** do convidado (usado só para identificar a foto — não cria conta nem sessão).
   2. Abrir a câmera (`capture="environment"`) e tirar a foto.
   3. Tela de revisão: aceitar a foto e prosseguir, ou tirar novamente (retake).
   4. Adicionar uma **legenda** à foto.
   5. Publicar — a foto entra no feed/galeria.

**Impacto no modelo de dados:** não há entidade `User` com autenticação. O nome do convidado é um campo simples (`guestName`) gravado diretamente na foto, sem senha e sem identidade persistida entre visitas.

## 3. Stack Tecnológica (Decidida)
- **Arquitetura:** Monorepo para facilitar o contexto da IA e sincronia entre Front e Back.
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS e ShadcnUI.
- **Backend:** Node.js com Express (hospedado no Render).
- **Banco de Dados & Storage:** Supabase (PostgreSQL + Supabase Storage para fotos).
- **ORM:** Prisma (para gestão do banco e tipagem estática).
- **Hospedagem:** Hostinger (Frontend) e Render (Backend).

## 4. Estrutura de Pastas (Monorepo)
- `/api`: Backend Express. Root directory para deploy no Render.
- `/apps/web`: Frontend Next.js. Root directory para deploy na Hostinger.
- `/packages/shared`: Tipagens do Prisma e interfaces comuns entre as aplicações.

## 5. Requisitos de Funcionalidade (UX/Mobile)
- **Sem autenticação:** nenhuma tela de login/cadastro. Único dado do convidado é o nome, coletado no fluxo de upload.
- **Landing page:** tela de apresentação acessada via QR code, com CTAs para "Ver galeria" e "Enviar foto".
- **Upload Inteligente:**
  - Fluxo guiado: nome → captura de foto → revisão (aceitar/retake) → legenda → publicar.
  - Usar `input` com `capture="environment"` para abrir a câmera diretamente no celular.
  - Implementar compressão de imagem no lado do cliente (frontend) antes do upload para economizar storage e banda (sugestão: `browser-image-compression`).
- **Galeria:** Layout em grade (grid) otimizado para mobile com carregamento dinâmico. CTA de upload sempre visível/fixo na tela (ex: botão flutuante), mesmo navegando pela galeria.
- **Desafios:** Lista de cards interativos que levam direto para a função de câmera.
- **Responsividade:** todo o frontend deve ser mobile-first — este é o único formato de uso esperado.

## 6. Instruções de Contexto para o Claude Code
- **Perfil do Dev:** Tenho experiência com Angular e LoopBack, mas este projeto será meu primeiro contato prático com Next.js, Prisma e ShadcnUI.
- **Apoio da IA:** Atue como mentor. Explique brevemente as decisões de estrutura e como configurar as ferramentas novas.
- **Padrões de Código:** Analise o diretório os `~/projects/dungeon-companion-web` e `~/projects/dungeon-companion-api` para entender meus padrões de organização de pastas, tratamento de erros e respostas de API, adaptando-os para a nova stack, e principalmente para entender a arquitetura que ja tenho funcionando, minha maior preocupação é colocar isso no ar.

## 7. Primeiras Tarefas (Roadmap)
1.  **Inicialização:** Criar a estrutura de pastas do monorepo e configurar o `package.json` raiz com workspaces.
2.  **Configuração Supabase/Prisma:**
    - Inicializar o Prisma na pasta `/api`.
    - Criar o schema inicial: `Photo` (com campo `guestName` e `caption`) e `Challenge` — **sem** entidade `User`/autenticação.
    - Orientar sobre como conectar a URL do Supabase no `.env`.
3.  **Configuração Frontend:**
    - Inicializar o Next.js em `/apps/web`.
    - Instalar Tailwind CSS e ShadcnUI (configurar componentes básicos como Button e Card).
    - Estruturar as rotas do fluxo: landing → galeria / upload (nome → captura → revisão → legenda).
4.  **Endpoint de Teste:** Criar uma rota na API que liste os desafios e uma página no Next.js que consuma esses dados para validar a arquitetura.