import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class SentryInterceptor implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
