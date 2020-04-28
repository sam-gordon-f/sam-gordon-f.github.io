from cfnlint import CloudFormationLintRule
from cfnlint import RuleMatch

class S3BucketsNotPublic(CloudFormationLintRule):
  """Check if S3 Bucket is Not Public"""
  id = 'E9020'
  shortdesc = 'S3 Buckets must never be public'
  
  def match(self, cfn):
    matches = list()
    resources = cfn.get_resources(['AWS::S3::Bucket'])
    for name, bucket in resources.items():
      path = ['Resources', name, 'Properties']
      full_path = ('/'.join(str(x) for x in path))
      if isinstance(bucket, dict):
        props = bucket.get('Properties')
        if props:
          access_control = props.get('AccessControl')
          if access_control:
            forbidden_values = ['PublicRead','PublicReadWrite']
          if access_control in forbidden_values:
            message =  "Property AccessControl set to {0} is forbidden in {1}"
            matches.append(RuleMatch(
              path,
              message.format(access_control, full_path)
            ))
    return matches
