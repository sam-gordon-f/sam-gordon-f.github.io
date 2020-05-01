CloudFormation do
  AWSTemplateFormatVersion '2010-09-09'
  Description "cfndsl-example"

  for i in 1..bucket_count do
    Resource("S3Bucket#{i}") do
      Type('AWS::S3::Bucket')

      Property('AccessControl', 'Private')
      Property('VersioningConfiguration', {
        "Status" => "Enabled"
      })
    end

    Resource("S3BucketPolicy#{i}") do
      Type('AWS::S3::BucketPolicy')
    
      Property('Bucket', Ref("S3Bucket#{i}"))
      Property('PolicyDocument', {
        'Version' => '2012-10-17',
        'Statement' => [
          {
            'Sid' => '',
            'Effect' => 'Allow',
            'Principal' => {
              'AWS' => external_account
            },
            'Action' => 's3:GetObject',
            'Resource' => FnJoin('', [
              FnGetAtt("S3Bucket#{i}", 'Arn'),
              '/*'
            ])
          },
          {
            'Sid' => '',
            'Effect' => 'Allow',
            'Principal' => {
              'AWS' => external_account
            },
            'Action' => 's3:ListBucket',
            'Resource' => FnGetAtt("S3Bucket#{i}", 'Arn')
          }
        ]
      })
    end
  end
end
