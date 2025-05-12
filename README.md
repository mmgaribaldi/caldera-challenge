## please download the image

```
docker pull mmgaribaldi/caldera-challenge:latest
```

## then run it

```
docker run -p 3000:3000 caldera-challenge:latest
```

## after that you should be able to access it like this:

```
curl http://localhost:3000/apache/airflow/bloat?start=v2.8.1&end=v2.9.3
```


### one output example

```
{"deltas":[{"previous_tag":"2.8.1","tag":"2.8.2","delta":0.9967272522973},{"previous_tag":"2.8.2","tag":"2.8.3","delta":0.9845653493998},{"previous_tag":"2.8.3","tag":"2.8.4","delta":1.0063496902452},{"previous_tag":"2.8.4","tag":"2.9.0","delta":1.0097098577244},{"previous_tag":"2.9.0","tag":"2.9.1","delta":1.0003374358767},{"previous_tag":"2.9.1","tag":"2.9.2","delta":1.0115490135204},{"previous_tag":"2.9.2","tag":"2.9.3","delta":1.0001539195477}]}
```
