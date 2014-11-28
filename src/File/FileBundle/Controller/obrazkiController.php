<?php

namespace File\FileBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use File\FileBundle\Entity\obrazki;
use File\FileBundle\Form\obrazkiType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\File\File;


/**
 * obrazki controller.
 *
 * @Route("/obrazki")
 */
class obrazkiController extends Controller
{

    /**
     * Lists all obrazki entities.
     *
     * @Route("/", name="obrazki")
     * @Method("GET")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('FileFileBundle:obrazki')->findAll();

        return array(
            'entities' => $entities,
        );
    }
    /**
     * Creates a new obrazki entity.
     *
     * @Route("/", name="obrazki_create")
     * @Method("POST")
     * @Template("FileFileBundle:obrazki:new.html.twig")
     */
    public function createAction(Request $request)
    {
        $entity = new obrazki();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('obrazki_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Creates a form to create a obrazki entity.
     *
     * @param obrazki $entity The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(obrazki $entity)
    {
        $form = $this->createForm(new obrazkiType(), $entity, array(
            'action' => $this->generateUrl('obrazki_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new obrazki entity.
     *
     * @Route("/new", name="obrazki_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction()
    {
        $entity = new obrazki();
        $form   = $this->createCreateForm($entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Finds and displays a obrazki entity.
     *
     * @Route("/{id}", name="obrazki_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('FileFileBundle:obrazki')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find obrazki entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing obrazki entity.
     *
     * @Route("/{id}/edit", name="obrazki_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('FileFileBundle:obrazki')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find obrazki entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
    * Creates a form to edit a obrazki entity.
    *
    * @param obrazki $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(obrazki $entity)
    {
        $form = $this->createForm(new obrazkiType(), $entity, array(
            'action' => $this->generateUrl('obrazki_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing obrazki entity.
     *
     * @Route("/{id}", name="obrazki_update")
     * @Method("PUT")
     * @Template("FileFileBundle:obrazki:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('FileFileBundle:obrazki')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find obrazki entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('obrazki_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * @Route("/droga")
     * @Template()
     */
    public function uploadAction()
    {
        $obrazki = new obrazki();
        $form = $this->createFormBuilder($obrazki)
            ->add('name')
            ->add('file')
            ->getForm()
        ;

        if ($this->getRequest()->getMethod() === 'POST') {
            $form->bindRequest($this->getRequest());




            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();

                $obrazki->upload();
                $em->persist($obrazki);
                $em->flush();

                $this->redirect($this->generateUrl('/uploads'));

            }
        }

        return array('form' => $form->createView());
    }
    /**
     * Deletes a obrazki entity.
     *
     * @Route("/{id}", name="obrazki_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('FileFileBundle:obrazki')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find obrazki entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('obrazki'));
    }



    /**
     * Creates a form to delete a obrazki entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('obrazki_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
