import {
  Template,
  TemplatePlaceholder,
  Plugin,
} from '@devexpress/dx-react-core';

export default class ToolbarTitle extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Plugin name="ToolbarTitle">
        <Template name="toolbarContent">
          <div style={{ textAlign: 'left' }}>
            <h2>{this.props.title}</h2>
          </div>
          <TemplatePlaceholder />
        </Template>
      </Plugin>
    );
  }
}
