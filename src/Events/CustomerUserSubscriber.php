<?php
namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface{
    private $security;
    public function __construct(Security $security){
        $this->security = $security;
    }
    public static function getSubscribedEvents(){
        return[
            KernelEvents::VIEW=>['setUserForCustomer',EventPriorities::PRE_VALIDATE]
        ];
    }
    public function setUserForCustomer(GetResponseForControllerResultEvent $event){
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($customer instanceof Customer && $method==="POST"){
            $user = $this->security->getUser();
            $customer->setUser($user);
        }
    }
}