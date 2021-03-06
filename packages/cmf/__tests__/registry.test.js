/* eslint no-underscore-dangle: ["error", {"allow": ["_registry", "_isLocked"] }] */
import registry from '../src/registry';

describe('CMF registry', () => {
	it('Registry should get a singleton', () => {
		// given
		const r1 = registry.Registry.getRegistry();
		const r2 = registry.Registry.getRegistry();
		const r3 = registry.getRegistry();

		// then
		expect(r1).toBe(r2);
		expect(r1).toBe(r3);
		expect(r1).toBe(registry.Registry._registry);
		expect(typeof r1).toBe('object');
	});

	it('addToRegistry should add item', () => {
		// given
		registry.addToRegistry('key', 'value');
		registry.addToRegistry('okey', { foo: 'bar' });

		// then
		expect(registry.Registry.getRegistry().key).toBe('value');
		expect(registry.Registry.getRegistry().okey.foo).toBe('bar');
	});

	it('getFromRegistry should return the item', () => {
		// given
		registry.addToRegistry('key', 'value');

		// when
		const value = registry.getFromRegistry('key');

		// then
		expect(value).toBe('value');
	});

	it('addToRegistry should warn that a registered item is overridden', () => {
		// given
		console.warn = jest.genMockFn();
		registry.addToRegistry('jso', 'value');

		expect(console.warn).not.toBeCalled();

		// when
		registry.addToRegistry('jso', 'otherValue');

		// then
		expect(console.warn).not.toBeCalledWith(
			'CMF: The \'key\' object is registered, overriding and existing \'key\' object. ' +
			'Please check your CMF configuration, you might not want that.'
		);
	});

	it('addToRegistry should throw error when registry is locked', () => {
		// given
		registry.lock();

		// when / then
		expect(() => registry.addToRegistry('key', 'value')).toThrow(
			'CMF: The registry is locked, you cannot therefore add \'key\' in it. ' +
			'Please check your CMF configuration, it should not move after the initial configuration before bootstrap.'
		);
	});
});
