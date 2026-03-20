**🩺 MedClin \- Sistema de Gestão Clínica Inteligente**

**Plataforma Full-Stack com Integração Climática e Geográfica**

O **MedClin** é uma solução completa para a gestão de clínicas e consultórios, desenvolvida para modernizar a interação entre médicos, administradores e pacientes. O sistema utiliza uma arquitetura distribuída, focada em usabilidade (Heurísticas de Nielsen) e em serviços inteligentes baseados na localização do paciente.

🚀 **Status do Projeto:** Em Produção (Cloud)

## ---

**🔗 Links Úteis**

### **🌐 Acesso ao Sistema (Ambiente de Produção)**

* **Aplicação Web (Frontend):** [https://\[URL\_DA\_SUA\_VERCEL\].vercel.app](https://www.google.com/search?q=https://%5BURL_DA_SUA_VERCEL%5D.vercel.app)  
* **API Service (Backend):** [https://\[URL\_DO\_SEU\_RENDER\].onrender.com](https://www.google.com/search?q=https://%5BURL_DO_SEU_RENDER%5D.onrender.com)

### **💻 Repositórios de Código (GitHub)**

* **Código-Fonte Frontend:** [https://github.com/PauloGalhardo/\[NOME\_REPOS\_FRONTEND\]](https://www.google.com/search?q=https://github.com/PauloGalhardo/%5BNOME_REPOS_FRONTEND%5D)  
* **Código-Fonte Backend:** [https://github.com/PauloGalhardo/\[NOME\_REPOS\_BACKEND\]](https://www.google.com/search?q=https://github.com/PauloGalhardo/%5BNOME_REPOS_BACKEND%5D)

## ---

**💎 Diferenciais e Funcionalidades**

* **Bloqueio de Agenda Duplicada:** Lógica de backend que impede conflitos de horário para o mesmo médico, garantindo integridade na escala de consultas.  
* **Suporte à Decisão Climática:** Integração com a API **OpenWeatherMap** para exibir as condições do tempo no dia da consulta, auxiliando o paciente e a clínica no planejamento.  
* **Automação de Endereço:** Integração com a API **ViaCEP** para preenchimento automático de logradouro, bairro e cidade a partir do CEP.  
* **Interface Responsiva:** Layout adaptativo utilizando Flexbox e CSS Grid com Media Queries, otimizado para Desktop e Mobile.  
* **Design Heurístico:** Interface projetada sob os princípios das **10 Heurísticas de Jakob Nielsen**, priorizando a prevenção de erros e a clareza de status.

## ---

**🛠 Stack Tecnológica**

| Camada | Tecnologia | Provedor de Cloud |
| :---- | :---- | :---- |
| **Frontend** | Vue.js 3, Axios, CSS3 | **Vercel** |
| **Backend** | Node.js, Express, JWT, Bcrypt | **Render** |
| **Banco de Dados** | MongoDB (Mongoose) | **MongoDB Atlas** |

## ---

**📂 Como Executar Localmente**

Como a aplicação possui repositórios separados, siga os passos abaixo:

### **1\. Servidor (Backend)**

Bash

\# Clone o repositório  
git clone https://github.com/PauloGalhardo/\[NOME\_REPOS\_BACKEND\].git  
cd \[NOME\_REPOS\_BACKEND\]

\# Instale as dependências  
npm install

\# Configure o arquivo .env com sua MONGO\_URI e JWT\_SECRET  
\# Inicie o servidor  
npm start

### **2\. Cliente (Frontend)**

Bash

\# Clone o repositório  
git clone https://github.com/PauloGalhardo/\[NOME\_REPOS\_FRONTEND\].git  
cd \[NOME\_REPOS\_FRONTEND\]

\# Instale as dependências  
npm install

\# Inicie a aplicação em modo de desenvolvimento  
npm run dev

## ---

**🔐 Segurança e Variáveis de Ambiente**

Para o funcionamento correto em produção, as seguintes chaves foram configuradas nos painéis da Vercel e do Render:

* MONGO\_URI: String de conexão com o cluster MongoDB Atlas.  
* JWT\_SECRET: Chave para criptografia dos tokens de autenticação.  
* VITE\_API\_URL: Endereço da API no Render (para o frontend).

### ---
