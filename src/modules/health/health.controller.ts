import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Object })
    @ApiOperation({ summary: 'Health check' })
    healthCheck() {
        return { status: 'OK' };
    }
}
