declare interface User {
	email: string
}

export declare function save(user: User): User;

export declare function update(user: User): User;

export declare type clean = (user: User) => User;