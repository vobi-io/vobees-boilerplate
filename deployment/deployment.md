1. https://console.cloud.google.com/kubernetes/list?project=vobi-231607
 gcloud container clusters get-credentials inw-cluster --zone europe-west3-a --project appDomain-123456

#### Develop
kubectl apply -f ./deployment/deployment-dev.yaml
kubectl expose deployment api-inw-dev --type=ClusterIP --name=api-inw-dev


#### Staging
kubectl apply -f ./deployment/deployment-staging.yaml
kubectl expose deployment api-inw-staging --type=ClusterIP --name=api-inw-staging


#### Production
kubectl apply -f ./deployment/deployment-prod.yaml
kubectl expose deployment api-inw-prod --type=ClusterIP --name=api-inw-prod




#### Ingress (Load balancer) config update (Load Balancer დაფაბლიშება და ინფორმაციის წამოღება: https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer)
kubectl apply -f ./deployment/ingress.yaml
kubectl get ingress basic-ingress

kubectl apply -f ./deployment/socket-nlb.yaml

gcloud compute addresses create vobi-ip --region us-central1
gcloud compute addresses describe vobi-global-ip --region us-central1



#გლობალური ip შექმნა https://cloud.google.com/kubernetes-engine/docs/tutorials/configuring-domain-name-static-ip
gcloud compute addresses create vobi-ip --global
gcloud compute addresses describe vobi-ip --global


build trigger:
1. https://console.cloud.google.com/cloud-build/triggers?authuser=1&project=vobi-231607



#build: ბილდი კონსოლიდან
gcloud builds submit . --config=./deployment/cloudbuild-dev.yaml

kubectl describe pod


#front

ბაკეტის ფაბლიკ წვდომის მიცემა
gsutil defacl ch -u AllUsers:R gs://landing.appDomain.ge
gsutil defacl ch -u AllUsers:R gs://appDomain-files
gsutil defacl ch -u AllUsers:R gs://appDomain.ge
gsutil defacl ch -u AllUsers:R gs://finvoice.ge
gsutil defacl ch -u AllUsers:R gs://staging.appDomain.ge



#create static ip
gcloud compute addresses create vobi-ip --region us-central1






#SSl sertificate https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-multi-ssl

###Step1:
openssl genrsa -out apiwrod-ingress.key 2048

###Step2:
openssl req -new -key apiwrod-ingress.key -out apiwrod-ingress.csr \
    -subj "/CN=apiword.vobi.io"

###Step3:
openssl x509 -req -days 365 -in apiwrod-ingress.csr -signkey apiwrod-ingress.key \
    -out apiwrod-ingress.crt

###Step4:
kubectl create secret tls apiword-secret \
  --cert apiwrod-ingress.crt --key apiwrod-ingress.key

###Step5:
upadate ingress file





### set static ip

gcloud compute addresses create finvoice-ip --region us-central1

gcloud compute addresses describe finvoice-ip --region us-central1

gcloud compute addresses create web-static-ip --global


### Generate service account for cloud build

 gcloud container clusters get-credentials inw-cluster --zone europe-west3-a --project appDomain-123456

PROJECT="$(gcloud projects describe \
    $(gcloud config get-value core/project -q) --format='get(projectNumber)')"
gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$PROJECT@cloudbuild.gserviceaccount.com --role=roles/container.developer

#### gcloud set project

gcloud config set project appDomain-123456


https://medium.com/google-cloud/setting-up-google-cloud-with-kubernetes-nginx-ingress-and-lets-encrypt-certmanager-bf134b7e406e



#### ngnix ingress

###### Connection to tiller
# Enter cluster shell and run that commands
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

helm init --service-account tiller

kubectl patch deploy --namespace kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'

helm init --service-account tiller --upgrade

###### Install nginx ingress
helm install --name nginx-ingress stable/nginx-ingress --set rbac.create=true
