<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">API REST para la gestión de películas de Star Wars, basada en SWAPI, con administración básica de usuarios.</p>
<p align="center">


## Configuración del proyecto

```bash
$ npm install
```

## Compilar y ejecutar el proyecto de manera local

Para ejecutar el proyecto, se debe iniciar el contenedor de MongoDB con el siguiente comando:

```bash
$ docker-compose up -d --build
```

Una vez levantado el contenedor de MongoDB, se provee un script para inicializar el usuario administrador:

```bash
$ npm run seed
```

Luego, se debe crear el archivo .env con las variables de entorno:

```bash
$ cp .env.example .env
```

Finalmente ejecutar el proyecto con alguno de los siguientes comandos:

```bash
# desarrollo
$ npm run start

# modo observador
$ npm run start:dev
```

## Ejecutar pruebas

```bash
# pruebas unitarias
$ npm run test

# cobertura de pruebas
$ npm run test:cov
```

## Documentación OPENAPI

La documentación de la API se encuentra en la ruta /docs.

## Hosting

El proyecto se encuentra desplegado en [Fly.io](https://nestjs-films.fly.dev/docs).
