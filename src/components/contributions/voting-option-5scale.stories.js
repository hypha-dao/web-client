import VotingOption5Scale from './voting-option-5scale.vue'

export default {
  title: 'Contributions/Voting Option 5Scale',
  component: VotingOption5Scale,
  argTypes: {}
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VotingOption5Scale },
  template: `
    <voting-option-5-scale v-bind="$props" />
  `
})

export const Example = Template.bind({})
Example.args = {
}

export const Base = Template.bind({})
