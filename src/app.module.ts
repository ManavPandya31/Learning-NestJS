import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

   TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const dbConfig = {
      type: 'postgres' as const,
      host: config.get('db.host'),
      port: config.get('db.port'),
      username: config.get('db.user'),
      password: config.get('db.pass'),
      database: config.get('db.name'),
      autoLoadEntities: true,
      synchronize: true,
    };

    console.log('PostgreSQL Connected Successfully');

    return dbConfig;
  },
}),

   UsersModule,
   AuthModule,
  ],
})
export class AppModule {}