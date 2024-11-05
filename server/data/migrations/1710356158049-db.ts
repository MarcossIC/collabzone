import { MigrationInterface, QueryRunner } from 'typeorm';

export class Db1710356158049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              CREATE TABLE \`user\` (
                  \`id\` int NOT NULL AUTO_INCREMENT,
                  \`external_id\` varchar(128) NOT NULL,
                  \`name\` varchar(80) NOT NULL,
                  \`email\` varchar(128) NOT NULL,
                  \`country\` varchar(80),
                  \`phone\` varchar(20),
                  \`role\` varchar(255) NOT NULL DEFAULT 'customer',
                  PRIMARY KEY (\`id\`)
              ) ENGINE=InnoDB;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
