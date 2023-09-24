import boto3

client = boto3.client('rekognition',
aws_access_key_id='',aws_secret_access_key='B',region_name='us-east-1')


imageSource=open('/Users/adargan/Documents/selfie2.jpg','rb')
imageTarget=open('/Users/adargan/Documents/selfie1.jpg','rb')

response=client.compare_faces(SimilarityThreshold=50,
                                SourceImage={'Bytes': imageSource.read()},
                                TargetImage={'Bytes': imageTarget.read()})

print("HERE")
print(response['FaceMatches'])
print(response)
for faceMatch in response['FaceMatches']:
    position = faceMatch['Face']['BoundingBox']
    confidence = str(faceMatch['Face']['Confidence'])
    print('The face at ' +
            str(position['Left']) + ' ' +
            str(position['Top']) +
            ' matches with ' + confidence + '% confidence')


