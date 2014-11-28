<?php

namespace File\FileBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * obrazki
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class obrazki
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column( type="string", length=255)
     * @Assert\NotBlank
     */
    private $name;


    /**
     * Get id
     *
     * @ORM\Column(type="string",length=255,nullable=true)
     *
     *
     */
    public $path;
    /**
     * @Assert\File(maxSize="6000000")
     */
    public $file;



    public function getAbsolutePath()
{
        return null==$this->path ? null : $this->getUploadDir().'/'.$this->path;
    }

    public function getWebPath()
    {
        return null === $this->path ? null : $this->getUploadDir().'/'.$this->path;
    }

    protected function getUploadRootDir()
    {
        // the absolute directory path where uploaded documents should be saved
        return __DIR__.'/../../../../web/'.$this->getUploadDir();
    }

    protected function getUploadDir()
    {
        // get rid of the __DIR__ so it doesn't screw when displaying uploaded doc/image in the view.
        return 'uploads/documents';
    }

    public function getId()
    {
        return $this->id;
    }



    public function upload()
    {
        // zmienna file może być pusta jeśli pole nie jest wymagane
        if (null === $this->file) {
            return;
        }

        // używamy oryginalnej nazwy pliku ale nie powinieneś tego robić
        // aby zabezpieczyć się przed ewentualnymi problemami w bezpieczeństwie

        // metoda move jako atrybuty przyjmuje ścieżkę docelową gdzie trafi przenoszony plik
        // oraz ścieżkę z której ma przenieś plik
        $this->file->move($this->getUploadRootDir(), $this->file->getClientOriginalName());

        // ustaw zmienną patch ścieżką do zapisanego pliku
        $this->setPath($this->file->getClientOriginalName());

        // wyczyść zmienną file ponieważ już jej nie potrzebujemy
        $this->file = null;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return obrazki
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set path
     *
     * @param string $path
     * @return obrazki
     */
    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * Get path
     *
     * @return string 
     */
    public function getPath()
    {
        return $this->path;
    }
}
