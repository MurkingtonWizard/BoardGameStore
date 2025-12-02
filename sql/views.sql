-- `bg-database`.AccountHidePassword source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `bg-database`.`AccountHidePassword` AS
select
    `bg-database`.`Account`.`email` AS `email`,
    `bg-database`.`Account`.`username` AS `username`,
    `bg-database`.`Account`.`funds` AS `funds`
from
    `bg-database`.`Account`;


-- `bg-database`.MiniBoardGame source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `bg-database`.`MiniBoardGame` AS
select
    `bg-database`.`BoardGame`.`id` AS `id`,
    `bg-database`.`BoardGame`.`name` AS `name`,
    `bg-database`.`BoardGame`.`description` AS `description`,
    `bg-database`.`BoardGame`.`price` AS `price`,
    `bg-database`.`BoardGame`.`thumbnail` AS `thumbnail`,
    `bg-database`.`BoardGame`.`game_rank` AS `game_rank`
from
    `bg-database`.`BoardGame`;
