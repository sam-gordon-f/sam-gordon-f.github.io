"""
testing rule written by sam gordon
"""
from cfnlint.rules import CloudFormationLintRule
from cfnlint.rules import RuleMatch
import cfnlint.helpers

class CheckBucketAccess(CloudFormationLintRule):
    """Check bucket set to public"""
    id = 'E9001'
    shortdesc = 'Bucket should not be public'
    description = 'Bucket should not be public'
    tags = ['resources']

    def match(self, cfn):
        """Check Tags for required keys"""

        matches = []

        # all_tags = cfn.search_deep_keys('Tags')
        # all_tags = [x for x in all_tags if x[0] == 'Resources']
        # resources_tags = self.get_resources_with_tags(cfn.regions[0])
        # resources = cfn.get_resources()
        # for resource_name, resource_obj in resources.items():
        #     resource_type = resource_obj.get('Type', "")
        #     resource_properties = resource_obj.get('Properties', {})
        #     if resource_type in resources_tags:
        #         if 'Tags' not in resource_properties:
        #             message = "Missing Tags Properties for {0}"
        #             matches.append(
        #                 RuleMatch(
        #                     ['Resources', resource_name, 'Properties'],
        #                     message.format('/'.join(map(str, ['Resources', resource_name, 'Properties'])))))

        return matches
