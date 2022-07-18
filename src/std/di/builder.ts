import { AnyConstructor, IDisposable, IServiceProvider } from "../primitives/interfaces.ts";

export type ActivatorDelegate = (serviceProvider: IServiceProvider, ...args: unknown[]) => AnyConstructor; 

export enum ServiceLifetime {
   Singleton = 0,
   Scoped = 1,
   Transient = 2,
}

export interface IServiceScope extends IDisposable {
    servicesProvider: IServiceProvider;
}

export interface IServiceDescriptor {
    lifetime: ServiceLifetime;
    serviceType: string;
    implementationType?: AnyConstructor;
    instance?: unknown;
    factory?: (serviceProvider: IServiceProvider) => unknown;
}

export interface IServiceCollection extends Array<IServiceDescriptor> {
    add(serviceType: string, implementationType: AnyConstructor, lifetime: ServiceLifetime): void;
}

export interface IServiceProviderFactory<TContainerBuilder> 
{
    createBuilder(services: ServiceCollection): TContainerBuilder;
    createServiceProvider(builder: TContainerBuilder): IServiceProvider;
}

export class ServiceCollection extends Array<IServiceDescriptor> {
    add(serviceDescriptor: IServiceDescriptor): void {
        this.push(serviceDescriptor);
    }
}

