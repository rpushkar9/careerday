# CareerDay

# Getting Started

The below guide is if you want to set up the website locally. Otherwise, go to [https://www.mycareer.day/](https://www.mycareer.day/).

## Install pnpm package manager

`pnpm` is a package manager built on top of `npm` and is much faster than `npm`, being highly disk efficient and solving inherent issues in `npm`.

Install `pnpm` if you don't already have it:

```
npm install -g pnpm
```

**Optional: set up a shorter alias like pn instead**

For POSIX systems, add the following to your .bashrc, .zshrc, or config.fish:

`alias pn=pnpm`

For Powershell (Windows), go to a Powershell window with admin rights and run:

`notepad $profile.AllUsersAllHosts`

In the profile.ps1 file that opens, put:

`set-alias -name pn -value pnpm`

Now whenever you have to run a `pnpm` cmd, you can type in `pn` (or whatever alias you created) instead.

## Install

Clone the repository and go into the directory:

```
git clone https://github.com/careerday23/prototype.git

cd prototype
```

Install packages:

```
pnpm i
```

Run the development server:

```
pnpm dev
```
