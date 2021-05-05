<?php
$day = 3;
$lang = 'ru';
$arr = [
  'ru' => [1=>'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
  'en' => [1=>'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sanday']
];
echo $arr[$lang][$day];
?>