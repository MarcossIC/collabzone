import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1711027834774 implements MigrationInterface {
  name = 'Migrations1711027834774';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`car\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`brand\` varchar(80) NOT NULL, \`model\` varchar(80) NOT NULL, \`car_style\` enum ('sedan', 'coupe', 'convertivle', 'hatchback', 'sport') NOT NULL DEFAULT 'sedan', \`color\` varchar(10) NOT NULL, \`passengers\` int NOT NULL, \`tank_size\` int NOT NULL, \`max_speed\` int NOT NULL, \`doors\` int NOT NULL, \`transmision\` enum ('manual', 'automatic') NOT NULL DEFAULT 'manual', \`ac\` tinyint NOT NULL DEFAULT 0, \`availability\` tinyint NOT NULL DEFAULT 1, \`pricePerDay\` double NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`is_deleted\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_d9479cbc9c65660b7cf9b65795\` (\`external_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`role\` enum ('customer', 'admin') NOT NULL DEFAULT 'customer'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'customer'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_d9479cbc9c65660b7cf9b65795\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_deleted\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`created_at\``);
    await queryRunner.query(`DROP TABLE \`car\``);
  }
}
