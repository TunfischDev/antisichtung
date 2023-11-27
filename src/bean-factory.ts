import {Constructable} from "./util/constructable";

class BeanFactory {

    private instances = new Map<Constructable<unknown>, unknown>();

    public getBean<T>(clazz: Constructable<T>): T {
        const existing = this.instances.get(clazz);
        if (existing) {
            return existing as T;
        } else {
            const instance = new clazz();
            this.instances.set(clazz, instance);
            return instance;
        }
    }
}

export const BF = new BeanFactory();
