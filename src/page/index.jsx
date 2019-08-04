import React, { Component } from 'react';
import withErrorBoundary from '../component/lib/WithErrorBoundary';
import BasicLayout from '../component/layout/BasicLayout';
import Demo from './demo';

@withErrorBoundary()
class Index extends Component {
  render() {
    return (
      <BasicLayout>
        <Demo/>
      </BasicLayout>
    );
  }
}

export default Index;
