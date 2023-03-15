import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { WebService } from './lib/web-service';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    new WebService(this, 'nginx-server', { image: 'nginx:1.23.3-alpine-slim', replicas: 1, port: 80, containerPort: 8083 });
    new WebService(this, 'apache-server', { image: 'httpd:alpine3.17', replicas: 1, port: 80, containerPort: 8085 });

  }
}

const app = new App();
new MyChart(app, 'cdk8s-demo');
app.synth();
