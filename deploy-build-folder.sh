npm run build
sshpass -p "szH,twY7P:8C" ssh masthy79@164.138.222.129 -p 1022 -t 'rm -rf /home/masthy79/Learneez/public/build'
sshpass -p "szH,twY7P:8C" scp -r -P 1022 public/build/. masthy79@164.138.222.129:/home/masthy79/Learneez/public/build
