# With Docker

This examples shows how to use Docker with Next.js based on the [deployment documentation](https://nextjs.org/docs/deployment#docker-image). Additionally, it contains instructions for deploying to Google Cloud Run. However, you can use any container-based deployment host.

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Clone the project
```bash
# Clone project
git clone project-git-url socian_converse_frontend

# Move to the project directory
cd socian_converse_frontend 
```

3. Build your container:
```shell
docker build -t socian_converse_frontend .
```
1. Run your container:
```shell
docker run -p 3000:3000 socian_converse_frontend
```

You can view your images created with `docker images`.

<hr /> 

## How to use

```bash
# Clone project
git clone project-git-url socian_converse_frontend

# Move to the project directory
cd socian_converse_frontend

# Install Dependencies
yarn install

# Start Development
yarn dev

# Start Build
yarn build
```

<hr />

## Running Locally

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.