
#for i in range(0, 360, 5):
#    print(f"tp @s ~ ~ ~ {i} 0\n"+
#"""execute at @s run summon armor_stand ^ ^ ^0.8 {Tags:["aura_vector"],Invisible:1b}
#execute as @e[tag=aura_vector,limit=1,sort=nearest] at @s run tp @s ~ ~ ~ facing entity @e[tag=aura_execute,limit=1,sort=nearest]""")

for i in range(2, 21):
    print("execute as @s[scores={"+f"auraTimer={i}"+"}] run execute as @e[tag=aura_vector] at @s run tp @s ^ ^ ^"+f"-{'{0:3.1f}'.format(0.8*(i-1))}")
