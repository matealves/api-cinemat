# Usar a imagem oficial do Node.js como imagem base
FROM node:20.10.0

# Criar e definir o diretório de trabalho no container
WORKDIR /app

# Copiar package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código da aplicação para o diretório de trabalho
COPY . .

# Compilar o projeto TypeScript para JavaScript
RUN npm run build

# Expor a porta que a aplicação vai rodar
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["npm", "start"]
