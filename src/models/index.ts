import {defineStore} from "pinia";

interface mongooseModel {
	_id: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export declare global {
	export interface Chatbot extends mongooseModel {
		phone?: string;
		phoneId?: string;
	}

	export interface FlowNode extends mongooseModel {
		name: string;
		nodeId: string;
		metadata: {
			positionX: number;
			positionY: number;
		},
		options: [],
		message: {
			header?: string;
			text: string;
		}
	}

	export interface User {
		email?: string;
	}

	type Partiall<T> = {
		[P in keyof T]?: T[P] extends object ? Partiall<T[P]> : T[P]
	}
}