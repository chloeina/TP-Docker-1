# TP-Docker
C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker --version
Docker version 28.3.3, build 980b856

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker images
REPOSITORY    TAG       IMAGE ID       CREATED       SIZE
hello-world   latest    a0dfb02aac21   3 weeks ago   20.3kB

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker pull hello-world
Using default tag: latest
latest: Pulling from library/hello-world
Digest: sha256:a0dfb02aac212703bfcb339d77d47ec32c8706ff250850ecc0e19c8737b18567
Status: Image is up to date for hello-world:latest
docker.io/library/hello-world:latest

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker run hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED              STATUS                          PORTS     NAMES
5937d5ec880a   hello-world   "/hello"   About a minute ago   Exited (0) About a minute ago             eloquent_jepsen
94097f6ffdca   hello-world   "/hello"   28 minutes ago       Exited (0) 28 minutes ago                 dreamy_pike 

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker rm 5937d5ec880a  
5937d5ec880a

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS     NAMES
94097f6ffdca   hello-world   "/hello"   30 minutes ago   Exited (0) 30 minutes ago             dreamy_pike

C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker rmi a0dfb02aac21
Untagged: hello-world:latest
Deleted: sha256:a0dfb02aac212703bfcb339d77d47ec32c8706ff250850ecc0e19c8737b18567