<?php
namespace My\frontendBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use My\frontendBundle\Entity\Name;


class ArticleFixtures implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $data = file('data/imiona.txt');
            foreach ($data as $i) {
                $Name = New Name();
                $Name->setCaption(trim($i));
                $manager->persist($Name);
            }
           $manager->flush();
    }
}
