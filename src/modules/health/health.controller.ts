import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Health check response',
        schema: {
            type: 'object',
            example: {
                status: 'OK',
            },
            properties: {
                status: {
                    type: 'string',
                    example: 'OK',
                },
            },
        },
    })
    @ApiOperation({ summary: 'Health check' })
    healthCheck() {
        return { status: 'OK' };
    }
}
