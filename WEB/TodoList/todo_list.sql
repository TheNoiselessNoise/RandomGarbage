SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `todo_list` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `todo_list`;

DROP TABLE IF EXISTS `priorities`;
CREATE TABLE IF NOT EXISTS `priorities` (
  `id` int(11) NOT NULL,
  `priority` varchar(30) NOT NULL,
  `color` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `priorities` (`id`, `priority`, `color`) VALUES
(1, 'None', 'none'),
(2, 'Low', 'low'),
(3, 'Medium', 'medium'),
(4, 'High', 'high'),
(5, 'Highest', 'highest');

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `priority_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_priority` (`priority_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_tasks_prio` FOREIGN KEY (`priority_id`) REFERENCES `priorities` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
