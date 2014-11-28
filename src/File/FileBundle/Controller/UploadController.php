<?php

namespace File\FileBundle\Controller;

use File\FileBundle\Models\Document;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
    use Symfony\Component\HttpFoundation\File\UploadedFile;
use File\FileBundle\Entity\obrazki;

class UploadController extends Controller
{
    /**
     * @Route("/upload")
     * @Template()
     */

        public function uploadAction(Request $request) {
        if ($request->getMethod() == 'POST') {
            $image = $request->files->get('img');
            $status = 'success';
            $uploadedURL='';
            $message='';
            if (($image instanceof UploadedFile) && ($image->getError() == '0')) {
                if (($image->getSize() < 2000000000)) {
                    $originalName = $image->getClientOriginalName();
                    echo $image->getClientOriginalName();
                    $name_array = explode('.', $originalName);

                    foreach (  $name_array as $l)
                    {
                        echo $l;
                    }

                    $file_type = $name_array[sizeof($name_array) - 1];
                    $valid_filetypes = array('jpg', 'jpeg', 'bmp', 'png');
                    if (in_array(strtolower($file_type), $valid_filetypes)) {
                        //Start Uploading File

                        $document = new Document();
                        $document->setFile($image);
                        $document->setSubDirectory('uploads');
                        $document->processFile();
                        $uploadedURL=$uploadedURL = $document->getUploadDirectory() . DIRECTORY_SEPARATOR . $document->getSubDirectory() . DIRECTORY_SEPARATOR . $image->getBasename();
                        echo $uploadedURL;
                    } else {
                        $status = 'failed';
                        $message = 'Invalid File Type';
                    }
                } else {
                    $status = 'failed';
                    $message = 'Size exceeds limit';
                }
            } else {
                $status = 'failed';
                $message = 'File Error';
            }
            return array('status'=>$status,'message'=>$message,'uploadedURL'=>$uploadedURL);
        } else {
            return array();
        }
    } }


