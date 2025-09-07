import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger'

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Films API')
    .setDescription('The films API')
    .addBearerAuth()
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)

  document.tags = [
    { name: 'Auth', description: 'Endpoints for authentication' },
    { name: 'Films', description: 'Endpoints for film management' },
    { name: 'Health', description: 'Endpoints to check the health and status of the system' },
  ]

  SwaggerModule.setup('docs', app, document)
}