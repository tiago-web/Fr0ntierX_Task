import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.getResponse();
    const status = exception.getStatus();

    const data = error instanceof Object ? { ...error } : { message: error };

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      data,
    });

    console.error("HTTP Error filtered:", error);
  }
}
