FROM centos

MAINTAINER Xander Grzywinski

ADD . /home/codebuddies

WORKDIR /home/codebuddies

RUN yum update
RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
RUN yum -y install nodejs
RUN curl https://install.meteor.com/ | sh
RUN meteor npm install
RUN meteor npm install --save faker

CMD meteor --allow-superuser --settings settings-development.json
