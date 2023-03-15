import { Construct } from 'constructs';
import { Names } from 'cdk8s';
// import { KubeDeployment, KubeService, IntOrString }
// import { IntOrString, KubeDeployment, KubeService, Quantity } from '../imports/k8s';
import { IntOrString, KubeDeployment, KubeService } from '../imports/k8s';

export interface WebServiceProps {
  /**
   * The Docker image to use for this service.
   */
  readonly image: string;

  /**
   * Number of replicas.
   *
   * @default 1
   */
  readonly replicas?: number;

  /**
   * External port.
   *
   * @default 80
   */
  readonly port?: number;

  /**
   * Internal port.
   *
   * @default 8080
   */
  readonly containerPort?: number;
}

export class WebService extends Construct {
  constructor(scope: Construct, id: string, props: WebServiceProps) {
    super(scope, id);

    const port = props.port || 80;
    const containerPort = props.containerPort || 8080;
    const label = { app: Names.toDnsLabel(this) };
    const replicas = props.replicas ?? 1;

    new KubeService(this, 'service', {
      spec: {
        type: 'ClusterIP',
        ports: [ { port, targetPort: IntOrString.fromNumber(containerPort) } ],
        selector: label
      }
    });

    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'app',
                image: props.image,
                ports: [ { containerPort } ],
                // resources: {
                //     limits: {
                //         "memory": Quantity.fromString("50Mi"),
                //         "cpu": Quantity.fromString("50m")
                //     },
                //     requests: {
                //         "memory": Quantity.fromString("50Mi"),
                //         "cpu": Quantity.fromString("50m")
                //     }
                // }
              }
            ]
          }
        }
      }
    });
  }
}