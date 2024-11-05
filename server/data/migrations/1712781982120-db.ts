import { MigrationInterface, QueryRunner } from 'typeorm';

export class Db1712781982120 implements MigrationInterface {
  name = 'Db1712781982120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`external_id\` varchar(128) NOT NULL, \`name\` varchar(80) NOT NULL, \`email\` varchar(128) NOT NULL, \`country\` varchar(80) NULL, \`phone\` varchar(20) NULL, \`role\` enum ('customer', 'admin') NOT NULL DEFAULT 'customer', UNIQUE INDEX \`IDX_d9479cbc9c65660b7cf9b65795\` (\`external_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`car\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`brand\` varchar(80) NOT NULL, \`model\` varchar(80) NOT NULL, \`car_style\` enum ('sedan', 'coupe', 'convertivle', 'hatchback', 'sport', 'suv', 'pickup', 'van', '') NOT NULL DEFAULT '', \`color\` varchar(10) NOT NULL, \`passengers\` int NOT NULL, \`tank_size\` int NOT NULL, \`max_speed\` int NOT NULL, \`doors\` int NOT NULL, \`transmision\` enum ('manual', 'automatic') NOT NULL DEFAULT 'manual', \`ac\` tinyint NOT NULL DEFAULT 0, \`availability\` tinyint NOT NULL DEFAULT 1, \`pricePerDay\` double NOT NULL, \`img\` varchar(255) NOT NULL, \`desc\` varchar(255) NULL DEFAULT 'Description not provided', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`car\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d9479cbc9c65660b7cf9b65795\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
