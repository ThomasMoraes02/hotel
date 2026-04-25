export default class Registry {
    dependencies: { [name: string]: any } = {};
    static instance: Registry;

    private constructor() {}


    provide(name: string, dependency: any): void {
        this.dependencies[name] = dependency;
    }

    inject(name: string): any {
        const dependency = this.dependencies[name];
        if (!dependency) throw new Error(`Dependency ${name} not found`);
        return dependency;
    }

    static getInstance(): Registry {
        if (!Registry.instance) {
            Registry.instance = new Registry();
        }
        return Registry.instance;
    }
}

export function inject(name: string) {
    return function (target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
            get() {
                return Registry.getInstance().inject(name);
            },
            enumerable: true,
            configurable: true
        });
    }
}