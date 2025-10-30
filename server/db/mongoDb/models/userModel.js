"use strict";

import mongoose from "mongoose";

const {Schema, model} = mongoose;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
		validate: {
			validator: (v) => {
				return /^[\w-+%]([\w-+%.](?!\.{2}))+[\w-+%]@([^-][-a-z]+[^-]\.)?([^-][-a-z]+[^-])(\.[a-z]{2,})+$/
						.test(v);
			},
			message: (props) => `${props.value} is not a valid email`,
		},
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		// required: false,
		// unique: true,
		// index: true,
		// validate: {
		//   validator: (v: string): boolean => {
		//     return /^[^-][-a-z]+[^-]$/.test(v);
		//   },
		//   message: (props: ValidatorProps) => "",
		// },
		// partialFilterExpression: {
		//   'username': {$exists: true}
		// }
	},
	phone: {
		type: String,
		required: false,
		unique: true,
		validate: {
			validator: (v) => {
				return /^[0-9]{11,13}$/.test(v);
			},
			message: (props) => `${props.value} is not a valid phone identifier`,
		},
	}
	/* containerName: {
		required: false,
		type: String,
		unique: true,
		validate: (v) => {
			return /^[a-z0-9]([-a-z0-9](?!-{2})){1,61}[a-z0-9]$/.test(v);
		},
	}, */
}, {
	virtuals: {
		isDataComplete: {
			get() {
				return !!this.username
			}
		}
	}
});

userSchema.index({username: 1}, {
	unique: true,
	partialFilterExpression: {
		"username": {$exists: true}
	}
})
userSchema.index({phoneNumber: 1}, {
	unique: true,
	partialFilterExpression: {
		"phoneId": {$exists: true}
	}
})

userSchema.set('toJSON', {
	versionKey: false,
	transform: (doc, ret) => {
		delete ret.password;
		delete ret._id;
		if (ret.username) delete ret.username;
		return ret;
	}
});


/*
[
      [
        (v: string): boolean => /^[a-z0-9]/.test(v) && /[a-z0-9]$/.test(v),
        "in-out",
      ],
      [
        (v: string): boolean => /^[-a-z0-9]+$/.test(v),
        "wron-char",
      ],
      [
        (v: string) => v.length >= 3,
        "too-short",
      ],
      [
        (v: string): boolean => v.length <= 63,
        "too-long",
      ],
    ],
 */

export const User = model("User", userSchema);
