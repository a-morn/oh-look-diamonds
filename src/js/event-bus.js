import DebugOptions from './debug-options.js';

export const events = {
	CRASH: 'events_crash',
	ROCKET_FIRED: 'events_rocket_fired'
};

let listeners = [];

export const on = (event, cb) => {
	listeners.push({
		event: event,
		call: cb
	});
};

export const off = (event, cb, all) => {
	listeners = listeners
		.filter(l => l.event !== event || (!all && cb !== l.call));
};

export const dispatch = (event) => {
	if (DebugOptions.logEvents)	console.log(event + ' dispatched');
	listeners
		.filter(l => l.event === event)
		.forEach(l => {
			if (DebugOptions.logEvents)	console.log('calling ' + l.call.name);
			l.call();
		});
};
